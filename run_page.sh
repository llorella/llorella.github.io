#!/bin/bash
. $HOME/.llt/exec/logcmd_llt/llt_wrapper.sh -f $HOME/llorella.github.io/index.html -m gpt-4-0125-preview -l test_home_page.ll 

if ! [ -f /home/luciano/.llt/exec/test_home_page ]; then
    echo "Exec dir for test_home_page ll thread was not created."
fi

